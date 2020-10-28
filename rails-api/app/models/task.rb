class Task < ApplicationRecord
  include Sortable

  enum status: { pending: 0, processing: 1, completed: 2 }

  belongs_to :project
  belongs_to :user,
             class_name: 'User', foreign_key: 'assigned_to', optional: true

  validates :summary, presence: true
  validates :description, presence: true
  validates :status, presence: true

  scope :by_query,
        lambda { |query|
          where(
            'lower(summary) ILIKE :query OR lower(description) ILIKE :query',
            query: "%#{query}%"
          )
        }
  scope :by_status, ->(status) { where(status: status) }
end
