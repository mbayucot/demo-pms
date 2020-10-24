require 'rails_helper'

RSpec.describe TaskPolicy, type: :policy do
  subject { described_class.new(user, task) }

  let(:resolved_scope) { described_class::Scope.new(user, Task.all).resolve }

  let(:task) { create(:task) }

  context 'being a client' do
    let(:user) { create(:user, role: :client) }
    let(:project) { create(:project, created_by: user.id) }
    let(:task) { create(:task, project_id: project.id) }

    it 'includes task in resolved scope' do
      expect(resolved_scope).to include(task)
    end

    it { is_expected.to permit_actions(%i[index show create update destroy]) }
  end

  context 'being a staff' do
    let(:user) { create(:user, role: :staff) }
    let(:task) { create(:task, assigned_to: user.id) }

    it 'includes task in resolved scope' do
      expect(resolved_scope).to include(task)
    end

    it { is_expected.to permit_actions(%i[index show create update destroy]) }
  end

  context 'being an administrator' do
    let(:user) { create(:user, role: :admin) }

    it 'includes task in resolved scope' do
      expect(resolved_scope).to include(task)
    end

    it { is_expected.to permit_actions(%i[index show create update destroy]) }
  end
end
