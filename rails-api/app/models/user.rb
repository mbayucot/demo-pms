class User < ApplicationRecord
  include Sortable

  enum role: { client: 0, staff: 1, admin: 2 }

  has_one_attached :avatar

  has_many :projects,
           foreign_key: 'created_by', class_name: 'Project', dependent: :destroy
  has_many :tasks,
           foreign_key: 'assigned_to', class_name: 'Task', dependent: :destroy

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

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: JwtDenylist
end
