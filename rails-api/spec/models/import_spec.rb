require 'rails_helper'

RSpec.describe Import, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:user) }

    it { is_expected.to have_one_attached(:file) }
  end

  describe 'callbacks' do
    it 'runs import job' do
      ActiveJob::Base.queue_adapter = :test
      expect { create(:import) }.to have_enqueued_job(ImportJob)
    end
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:klass) }
    it { is_expected.to validate_presence_of(:uuid) }
  end

  describe 'file' do
    it do
      expect(subject).to validate_content_type_of(:file).allowing('text/csv')
    end
  end
end
