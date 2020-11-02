require 'rails_helper'

RSpec.describe Import, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:user) }

    it { is_expected.to have_one_attached(:file) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:uuid) }
    it { is_expected.to validate_presence_of(:klass) }
  end

  describe 'callbacks' do
    describe '#after_create_commit' do
      it 'runs import job' do
        ActiveJob::Base.queue_adapter = :test
        create(:import, file: FilesTestHelper.csv)
        expect(ImportJob).to have_been_enqueued
      end
    end
  end
end
