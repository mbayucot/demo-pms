require 'rails_helper'

RSpec.describe UserMailer, type: :mailer do
  let(:user) { create(:user) }

  describe 'confirmation_instructions' do
    let(:mail) do
      described_class.confirmation_instructions(user, 'faketoken', {})
    end

    it 'renders the headers', :aggregate_failures do
      expect(mail.subject).to eq('Confirmation instructions')
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq([ENV['MAILER_FROM']])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to match('Confirm my account')
    end
  end

  describe 'reset_password_instructions' do
    let(:mail) do
      described_class.reset_password_instructions(user, 'faketoken', {})
    end

    it 'renders the headers', :aggregate_failures do
      expect(mail.subject).to eq('Reset password instructions')
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq([ENV['MAILER_FROM']])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to match('Change my password')
    end
  end
end
