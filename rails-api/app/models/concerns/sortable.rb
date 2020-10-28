module Sortable
  extend ActiveSupport::Concern

  included do
    scope :by_sort,
          lambda { |column, direction|
            order(sort_column(column) + ' ' + sort_direction(direction))
          }
  end

  class_methods do
    def sort_column(column)
      column_names.include?(column) ? column : 'created_at'
    end

    def sort_direction(direction)
      %w[asc desc].include?(direction) ? direction : 'desc'
    end
  end
end
