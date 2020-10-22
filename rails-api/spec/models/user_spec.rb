require 'rails_helper'

RSpec.describe User, type: :model do
  it do
    should define_enum_for(:role).with_values(user: 0, staff: 1, admin: 2)
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_presence_of(:password) }
  end
end
