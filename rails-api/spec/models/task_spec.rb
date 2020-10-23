require 'rails_helper'

RSpec.describe Task, type: :model do
  it do
    is_expected.to define_enum_for(:status).with_values(
      pending: 0, processing: 1, completed: 2
    )
  end

  it do
    is_expected.to belong_to(:user).class_name('User').with_foreign_key(
      'assigned_to'
    ).optional
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:summary) }
    it { is_expected.to validate_presence_of(:description) }
    it { is_expected.to validate_presence_of(:status) }
  end
end
