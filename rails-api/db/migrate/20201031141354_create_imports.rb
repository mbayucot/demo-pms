class CreateImports < ActiveRecord::Migration[6.0]
  def change
    create_table :imports do |t|
      t.string :klass
      t.string :uuid
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
