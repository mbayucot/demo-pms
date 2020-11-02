class ExportSerializer < ActiveJob::Serializers::ObjectSerializer
  def serialize?(argument)
    argument.is_a? Export
  end

  def serialize(export)
    super('uuid' => export.uuid, 'klass' => export.klass, 'sql' => export.sql)
  end

  def deserialize(hash)
    Export.new(hash['uuid'], hash['klass'], hash['sql'])
  end
end
