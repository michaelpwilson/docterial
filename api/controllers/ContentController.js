/**
 * ContentController
 *
 * @description :: Server-side logic for managing contents
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	update: function(req, res) {

		Content.findOrCreate({id: req.body.content.id}, req.body.content).exec(function createFindCB(error, createdOrFoundRecords){

			console.log(error, createdOrFoundRecords);

			Content.update({
			  id: req.body.content.id
			}, req.body.content, function(err, contents) {

				if (err) {

					return console.log(err);

				}

			});

		});

	}

};

