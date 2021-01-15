class UserSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :email, :first_name, :last_name, :avatar, :role, :role_fmt, :full_name, :created_at, :updated_at

  def avatar
    url_for(object.avatar) if object.avatar.attached?
  end

  def full_name
    [object.first_name, object.last_name].select(&:present?).join(' ').titleize
  end

  def role_fmt
    object.status.capitalize
  end
end
