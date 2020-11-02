require 'rails_helper'

RSpec.describe ImportPolicy, type: :policy do
  subject { described_class.new(user, import) }

  let(:import) { create(:import) }

  context 'being a client' do
    let(:user) { create(:user, role: :client) }

    it { is_expected.to permit_action(:import) }
  end

  context 'being a staff' do
    let(:user) { create(:user, role: :staff) }

    it { is_expected.to forbid_action(:import) }
  end

  context 'being an administrator' do
    let(:user) { create(:user, role: :admin) }

    it { is_expected.to forbid_action(:import) }
  end
end
