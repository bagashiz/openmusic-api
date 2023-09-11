/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.createTable('songs', {
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},
		title: {
			type: 'TEXT',
			notNull: true,
		},
		year: {
			type: 'INTEGER',
			notNull: true,
		},
		genre: {
			type: 'TEXT',
			notNull: true,
		},
		performer: {
			type: 'TEXT',
			notNull: true,
		},
		duration: {
			type: 'INTEGER',
		},
		created_at: {
			type: 'TIMESTAMP',
			notNull: true,
		},
		updated_at: {
			type: 'TIMESTAMP',
			notNull: true,
		},
		album_id: {
			type: 'VARCHAR(50)',
			references: 'albums(id)',
		},
	});

	pgm.addConstraint('songs', 'fk_songs_album_id', {
		foreignKeys: {
			columns: 'album_id',
			references: 'albums(id)',
			onDelete: 'cascade',
		},
	});
};

exports.down = (pgm) => {
	pgm.dropTable('songs');
};
