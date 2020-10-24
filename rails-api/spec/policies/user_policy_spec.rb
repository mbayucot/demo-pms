require 'rails_helper'

RSpec.describe UserPolicy, type: :policy do
  subject { described_class.new(user, resource) }

  let(:resolved_scope) { described_class::Scope.new(user, User.all).resolve }

  let(:resource) { create(:user) }

  context 'being a client' do
    let(:user) { create(:user, role: :client) }

    it { is_expected.to permit_actions(%i[show create update]) }
  end

  context 'being a staff' do
    let(:user) { create(:user, role: :staff) }

    it 'includes resource in resolved scope' do
      expect(resolved_scope).to include(resource)
    end

    it { is_expected.to permit_actions(%i[index show create update]) }
  end

  context 'being an administrator' do
    let(:user) { create(:user, role: :admin) }

    it 'includes resource in resolved scope' do
      expect(resolved_scope).to include(resource)
    end

    it { is_expected.to permit_actions(%i[index show create update destroy]) }
  end
end
