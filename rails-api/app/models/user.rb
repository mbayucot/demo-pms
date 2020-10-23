class User < ApplicationRecord
  enum role: { user: 0, staff: 1, admin: 2 }

  has_many :projects,
           foreign_key: 'created_by', class_name: 'Project', dependent: :destroy
  has_many :tasks,
           foreign_key: 'assigned_to', class_name: 'Task', dependent: :destroy

  validates :email, presence: true
  validates :password, presence: true

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
