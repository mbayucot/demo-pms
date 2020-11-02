require 'rails_helper'

class SortableClass < ActiveRecord::Base
  self.table_name = 'users'

  include Sortable
end

RSpec.describe Sortable do
  context 'with valid parameters' do
    it 'sorts correctly' do
      column = 'email'
      direction = 'desc'
      expect(
        SortableClass.by_sort(column, direction).to_sql
      ).to eq SortableClass.order(column + ' ' + direction).to_sql
    end
  end

  context 'with invalid parameters' do
    it 'sorts by created_at desc' do
      column = nil
      direction = nil
      expect(
        SortableClass.by_sort(column, direction).to_sql
      ).to eq SortableClass.order('created_at desc').to_sql
    end
  end
end
