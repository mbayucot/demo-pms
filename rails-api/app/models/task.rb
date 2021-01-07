class Task < ApplicationRecord
  include Sortable
  include Importable

  CSV_IMPORT = %w[summary description].freeze

  enum status: { pending: 0, processing: 1, completed: 2 }

  belongs_to :project
  belongs_to :user,
             class_name: 'User', foreign_key: 'assigned_to', optional: true

  validates :summary, presence: true, uniqueness: { scope: :project_id }
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
  scope :by_assigned_to, ->(assigned_to) { where(assigned_to: assigned_to) }
end
