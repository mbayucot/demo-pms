require 'csv'

module Exportable
  extend ActiveSupport::Concern
  include Exceptions

  class_methods do
    def to_csv(query)
      unless const_defined?('CSV_EXPORT')
        raise Exceptions::MissingRequirement,
              "Missing constant in #{self}: CSV_EXPORT"
      end

      CSV.generate(headers: true) do |csv|
        csv << self::CSV_EXPORT

        find_by_sql(query).each do |resource|
          csv << self::CSV_EXPORT.map { |attr| resource.send(attr) }
        end
      end
    end
  end
end
