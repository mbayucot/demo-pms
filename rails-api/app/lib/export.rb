class Export
  attr_accessor :uuid, :klass, :sql

  def initialize(uuid, klass, sql)
    @uuid = uuid
    @klass = klass
    @sql = sql
  end
end
