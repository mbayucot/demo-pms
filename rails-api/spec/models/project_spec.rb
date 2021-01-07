require 'rails_helper'

RSpec.describe Project, type: :model do
  describe 'constants' do
    it { expect(subject.class).to be_const_defined(:CSV_EXPORT) }
  end

  describe 'associations' do
    it do
      expect(subject).to belong_to(:user).class_name('User').with_foreign_key(
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

    describe '.by_created_by' do
      it 'finds projects by created_by' do
        created_by = 1
        expect(
          described_class.by_created_by(created_by).to_sql
        ).to eq described_class.where(created_by: created_by).to_sql
      end
    end
  end
end
