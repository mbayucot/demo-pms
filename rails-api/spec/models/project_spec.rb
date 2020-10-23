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
end
