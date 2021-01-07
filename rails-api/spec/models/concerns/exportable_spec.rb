require 'rails_helper'
require 'csv'

class ExportableClass < ActiveRecord::Base
  self.table_name = 'projects'

  include Exportable
end

RSpec.describe Exportable do
  let!(:projects) { create_list(:project, 2) }

  context 'with valid class' do
    subject(:rows) { CSV.parse(ExportableClass.to_csv(ExportableClass.all.to_sql)) }

    before { stub_const('ExportableClass::CSV_EXPORT', %w[name].freeze) }

    it 'generates no of rows correctly' do
      expect(rows.size).to eq(3)
    end

    it 'generates header correctly' do
      expect(rows[0]).to match_array(ExportableClass::CSV_EXPORT)
    end

    it 'generates data correctly', :aggregate_failures do
      expect(rows[1]).to match_array([projects.first.name])
      expect(rows[2]).to match_array([projects.second.name])
    end
  end

  context 'with invalid class' do
    it 'raises an error' do
      expect { ExportableClass.to_csv(ExportableClass.all.to_sql) }.to raise_error(
        Exceptions::MissingRequirement,
        'Missing constant in ExportableClass: CSV_EXPORT'
      )
    end
  end
end
