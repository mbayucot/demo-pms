class UserPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def create?
    true
  end

  def update?
    true
  end

  def destroy?
    user.admin?
  end

  class Scope < Scope
    def resolve
      user.client? ? scope.where(id: user.id).or(scope.where(role: :staff)) : scope.all
    end
  end
end
