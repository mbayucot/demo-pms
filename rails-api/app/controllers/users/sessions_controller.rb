# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  respond_to :json

  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def respond_to_on_destroy
    head :ok
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_in, keys: %i[email password domain])
  end
end
