require 'rails_helper'

RSpec.describe User, type: :model do
  it do
    is_expected.to define_enum_for(:role).with_values(
      client: 0, staff: 1, admin: 2
    )
  end

  describe 'associations' do
    it { is_expected.to have_one_attached(:avatar) }

    it do
      is_expected.to have_many(:projects).class_name('Project')
        .with_foreign_key('created_by').dependent(:destroy)
    end

    it do
      is_expected.to have_many(:tasks).class_name('Task').with_foreign_key(
        'assigned_to'
      ).dependent(:destroy)
    end

    it { is_expected.to have_many(:imports) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_presence_of(:password) }
  end

  describe 'scopes' do
    describe '.by_query' do
      it 'finds users by email or first_name or last_name' do
        query = Faker::Lorem.word
        expect(described_class.by_query(query).to_sql).to eq described_class
             .where(
             'lower(email) ILIKE :query OR lower(first_name) ILIKE :query OR lower(last_name) ILIKE :query',
             query: "%#{query}%"
           ).to_sql
      end
    end

    describe '.by_role' do
      it 'finds users by role' do
        role = 'admin'
        expect(described_class.by_role(role).to_sql).to eq described_class
             .where(role: role).to_sql
      end
    end
  end

  describe 'avatar' do
    it do
      is_expected.to validate_content_type_of(:avatar).allowing(
        'image/png',
        'image/jpeg'
      )
    end
  end
end
