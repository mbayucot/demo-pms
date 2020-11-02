class ImportPolicy < ApplicationPolicy
  def import?
    user.client?
  end
end
