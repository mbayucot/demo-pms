class Task < ApplicationRecord
  enum status: { pending: 0, processing: 1, completed: 2 }

  belongs_to :user, class_name: 'User', foreign_key: 'assigned_to', optional: true

  validates :summary, presence: true
  validates :description, presence: true
  validates :status, presence: true
end
