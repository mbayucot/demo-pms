require 'rails_helper'

RSpec.describe ProjectPolicy, type: :policy do
  subject { described_class.new(user, project) }

  let(:resolved_scope) { described_class::Scope.new(user, Project.all).resolve }

  let(:project) { create(:project) }

  context 'being a client' do
    let(:user) { create(:user, role: :client) }
    let(:project) { create(:project, created_by: user.id) }

    it 'includes project in resolved scope' do
      expect(resolved_scope).to include(project)
    end

    it { is_expected.to permit_actions(%i[index show create update destroy]) }
  end

  context 'being a staff' do
    let(:user) { create(:user, role: :staff) }

    it 'includes project in resolved scope' do
      expect(resolved_scope).to include(project)
    end

    it { is_expected.to permit_actions(%i[index show update]) }
  end

  context 'being an administrator' do
    let(:user) { create(:user, role: :admin) }

    it 'includes project in resolved scope' do
      expect(resolved_scope).to include(project)
    end

    it { is_expected.to permit_actions(%i[index show update destroy]) }
  end
end
