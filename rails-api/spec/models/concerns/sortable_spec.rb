require 'rails_helper'

class DummyClass < ActiveRecord::Base
  self.table_name = 'users'

  include Sortable
end

RSpec.describe Sortable do
  context 'with valid parameters' do
    it 'sorts correctly' do
      column = 'email'
      direction = 'desc'
      expect(DummyClass.by_sort(column, direction).to_sql).to eq DummyClass
           .order(column + ' ' + direction).to_sql
    end
  end
end
