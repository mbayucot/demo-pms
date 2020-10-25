require 'rails_helper'

RSpec.describe User, type: :model do
  it do
    is_expected.to define_enum_for(:role).with_values(
      client: 0, staff: 1, admin: 2
    )
  end

  describe 'associations' do
    it do
      is_expected.to have_many(:projects).class_name('Project')
        .with_foreign_key('created_by').dependent(:destroy)
    end

    it do
      is_expected.to have_many(:tasks).class_name('Task').with_foreign_key(
        'assigned_to'
      ).dependent(:destroy)
    end
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_presence_of(:password) }
  end

  describe 'avatar' do
    it { is_expected.to validate_attached_of(:avatar) }

    it do
      is_expected.to validate_content_type_of(:avatar).allowing(
        'image/png',
        'image/jpeg'
      )
    end
  end
end
