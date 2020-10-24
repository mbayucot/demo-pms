class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :first_name, :last_name
  attribute :role, if: -> { !current_user.client? }
end
