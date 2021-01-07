module Importable
  extend ActiveSupport::Concern
  include Exceptions

  class_methods do
    def import(file_path, params)
      unless const_defined?('CSV_IMPORT')
        raise Exceptions::MissingRequirement,
              "Missing constant in #{self}: CSV_IMPORT"
      end

      rows =
        SmarterCSV.process(
          file_path,
          { file_encoding: 'binary' }
        )
      rows.each { |row| create! row.to_hash.merge(JSON.parse(params)) }
    end
  end
end
