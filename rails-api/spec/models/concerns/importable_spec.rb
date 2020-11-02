require 'rails_helper'

class ImportableClass < ActiveRecord::Base
  self.table_name = 'projects'

  include Importable
end

RSpec.describe Importable do
  context 'with valid class' do
    before { stub_const('ImportableClass::CSV_IMPORT', %i[name].freeze) }

    context 'with valid csv' do
      it 'creates projects' do
        expect do
          ImportableClass.import(FilesTestHelper.projects_csv)
        end.to change(ImportableClass, :count).by(2)
      end
    end

    context 'with invalid csv' do
      it 'raises an error' do
        expect { ImportableClass.import(FilesTestHelper.csv) }.to raise_error(
          SmarterCSV::MissingHeaders
        )
      end
    end
  end

  context 'with invalid class' do
    it 'raises an error' do
      expect do
        ImportableClass.import(FilesTestHelper.projects_csv)
      end.to raise_error(
        Exceptions::MissingRequirement,
        'Missing constant in ImportableClass: CSV_IMPORT'
      )
    end
  end
end
