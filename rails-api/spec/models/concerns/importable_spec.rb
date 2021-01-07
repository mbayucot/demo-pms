require 'rails_helper'

class ImportableClass < ActiveRecord::Base
  self.table_name = 'projects'

  include Importable
end

RSpec.describe Importable do
  let(:user) { create(:user) }
  let(:params) { { created_by: 1 }.to_json }

  context 'with valid class' do
    before { stub_const('ImportableClass::CSV_IMPORT', %i[name].freeze) }

    context 'with valid csv' do
      it 'creates projects' do
        expect do
          ImportableClass.import(FilesTestHelper.projects_csv, { created_by: user.id }.to_json)
        end.to change(ImportableClass, :count).by(2)
      end
    end

    context 'with invalid csv' do
      it 'raises an error' do
        expect { ImportableClass.import(FilesTestHelper.csv, { created_by: user.id }.to_json) }.to raise_error(
           ActiveModel::UnknownAttributeError
        )
      end
    end
  end

  context 'with invalid class' do
    it 'raises an error' do
      expect do
        ImportableClass.import(FilesTestHelper.projects_csv, { created_by: user.id }.to_json)
      end.to raise_error(Exceptions::MissingRequirement)
    end
  end
end
