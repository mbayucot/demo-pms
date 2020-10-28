require 'rails_helper'

RSpec.describe Task, type: :model do
  it do
    is_expected.to define_enum_for(:status).with_values(
      pending: 0, processing: 1, completed: 2
    )
  end

  describe 'associations' do
    it { is_expected.to belong_to(:project) }

    it do
      is_expected.to belong_to(:user).class_name('User').with_foreign_key(
        'assigned_to'
      ).optional
    end
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:summary) }
    it { is_expected.to validate_presence_of(:description) }
    it { is_expected.to validate_presence_of(:status) }
  end

  describe 'scopes' do
    describe '.by_query' do
      it 'finds tasks by name' do
        query = Faker::Lorem.word
        expect(described_class.by_query(query).to_sql).to eq described_class
             .where(
             'lower(summary) ILIKE :query OR lower(description) ILIKE :query',
             query: "%#{query}%"
           ).to_sql
      end
    end

    describe '.by_status' do
      it 'finds tasks by status' do
        status = 'completed'
        expect(described_class.by_status(status).to_sql).to eq described_class
             .where(status: status).to_sql
      end
    end
  end
end
