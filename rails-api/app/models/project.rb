class Project < ApplicationRecord
  belongs_to :user, class_name: 'User', foreign_key: 'created_by'

  has_many :tasks, dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :created_by }
  validates :created_by, presence: true
end
