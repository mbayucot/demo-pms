module ExceptionHandler
  extend ActiveSupport::Concern

  include Pundit

  included do
    rescue_from ActiveRecord::RecordNotFound do |exception|
      render json: { error: exception.message }, status: :not_found
    end

    rescue_from ActiveRecord::RecordInvalid do |exception|
      render json: exception.record.errors, status: :unprocessable_entity
    end

    rescue_from Pundit::NotAuthorizedError do
      render json: { error: 'You cannot perform this action.' },
             status: :forbidden
    end
  end
end
