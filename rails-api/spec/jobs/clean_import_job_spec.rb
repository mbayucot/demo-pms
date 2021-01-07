require 'rails_helper'

RSpec.describe CleanImportJob, type: :job do
  describe '#perform_later' do
    it 'destroys old imports' do
      ActiveJob::Base.queue_adapter = :test
      expect { described_class.perform_later }.to have_enqueued_job
    end
  end
end
