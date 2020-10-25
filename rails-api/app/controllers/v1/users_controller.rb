class V1::UsersController < ApplicationController
  # GET /v1/users
  def show
    render json: current_user
  end

  # PATCH/PUT /v1/users
  def update
    @user = current_user
    @user.avatar.attach(params[:avatar]) if params[:avatar].present?
    @user.update!(user_params)

    render json: @user
  end

  # PATCH/PUT /v1/users/update_password
  def update_password
    @user = current_user
    if @user.update_with_password(user_params)
      bypass_sign_in(@user)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.permit(
      :email,
      :current_password,
      :password,
      :password_confirmation,
      :first_name,
      :last_name,
      :avatar
    )
  end
end
