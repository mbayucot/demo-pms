require 'rails_helper'

RSpec.describe ImportJob, type: :job do
  describe '#perform_later' do
    it 'imports a csv' do
      ActiveJob::Base.queue_adapter = :test
      document = create(:import)
      expect { described_class.perform_later(document) }.to have_enqueued_job
    end
  end
end
