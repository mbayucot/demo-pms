class Project < ApplicationRecord
  include Importable
  include Exportable
  include Sortable

  CSV_IMPORT = %w[name].freeze
  CSV_EXPORT = %w[name].freeze

  belongs_to :user, class_name: 'User', foreign_key: 'created_by'

  has_many :tasks, dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :created_by }
  validates :created_by, presence: true

  scope :by_query,
        ->(query) { where('lower(name) ILIKE :query', query: "%#{query}%") }
  scope :by_created_by, ->(created_by) { where(created_by: created_by) }
end
