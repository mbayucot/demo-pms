module Importable
  extend ActiveSupport::Concern
  include Exceptions

  class_methods do
    def import(file_path)
      unless const_defined?('CSV_IMPORT')
        raise Exceptions::MissingRequirement,
              "Missing constant in #{self}: CSV_IMPORT"
      end

      rows =
        SmarterCSV.process(
          file_path,
          { file_encoding: 'binary', required_headers: self::CSV_IMPORT }
        )
      rows.each { |row| create! row.to_hash }
    end
  end
end
