require 'rails_helper'

RSpec.describe Project, type: :model do
  describe 'associations' do
    it do
      is_expected.to belong_to(:user).class_name('User').with_foreign_key(
        'created_by'
      )
    end

    it { is_expected.to have_many(:tasks).dependent(:destroy) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_uniqueness_of(:name).scoped_to(:created_by) }
  end

  describe 'scopes' do
    describe '.by_query' do
      it 'finds projects by name' do
        query = Faker::Lorem.word
        expect(described_class.by_query(query).to_sql).to eq described_class
             .where('lower(name) ILIKE :query', query: "%#{query}%").to_sql
      end
    end
  end
end
