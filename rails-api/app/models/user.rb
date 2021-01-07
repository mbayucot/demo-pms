class User < ApplicationRecord
  include Sortable

  enum role: { client: 0, staff: 1, admin: 2 }

  has_one_attached :avatar

  has_many :projects,
           foreign_key: 'created_by', class_name: 'Project', dependent: :destroy
  has_many :tasks,
           foreign_key: 'assigned_to', class_name: 'Task', dependent: :destroy
  has_many :imports

  validates :email, presence: true
  validates :avatar, content_type: %i[png jpg jpeg]

  scope :by_query,
        lambda { |query|
          where(
            'lower(email) ILIKE :query OR lower(first_name) ILIKE :query OR lower(last_name) ILIKE :query',
            query: "%#{query}%"
          )
        }
  scope :by_role, ->(role) { where(role: role) }

  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    domain = conditions.delete(:domain)
    where(conditions.to_h).where(
      role: domain == 'client' ? 'client' : %w[admin staff]
    ).first
  end

  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :confirmable,
         :jwt_authenticatable,
         jwt_revocation_strategy: JwtDenylist,
         authentication_keys: %i[email domain]
end
