var
		request = require("request"),
		cheerio = require("cheerio"),
		pokemons = require('./source/pokemons.json'),
		fs = require('fs');

var
		dataPokemons = [];

var timeNum = 78;

function getPokemon (pokNum) {
//for (var i = 0; i < pokemons.pokemon.length; i++) {
	var url = "https://rankedboost.com/pokemon-go/" + pokemons.pokemon[pokNum].name;

	request(url, function (error, response, body) {
	  if (!error) {
		var
				$ = cheerio.load(body),
				imgPath = 'https://rankedboost.com/wp-content/themes/RB2/riot/poksimages/pokemons/',
				pokImg = $('.pok_main_img').attr('src').replace(imgPath, ''),
				download = function (uri, filename, callback) {
				  request.head(uri, function (err, res, body) {
					console.log('content-type:', res.headers['content-type']);
					console.log('content-length:', res.headers['content-length']);
					
					request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
				  });
				},
				poke = pokemons;


	
		//функция делает первую букву большой
		function capitalizeFirstLetter(string) {
		  return string.charAt(0).toUpperCase() + string.slice(1);
		}
		var name = $('.pok_top_block .pok_head').first().text(),
				num = pokImg.replace('.png', ''),
				numClean = num.replace(/\b0+/g, ''),
				percentEggCol1 = $('.one_half').prev('table').next('.one_half').find('td:contains("' + capitalizeFirstLetter(name) + '")'),
				percentEggCol2 = $('.one_half').prev('table').next('.one_half').next('.one_half').find('td:contains("' + capitalizeFirstLetter(name) + '")');


		//формируем массив данных
		var data = {
		  "id": poke.pokemon[numClean - 1].id,
		  "num": num,
		  "name": name,
		  "weight": $('.weight .one_stat_value').text().replace(' kg', ''),
		  "height": $('.one_stat .one_stat_value').last().text().replace(' m', ''),
		  "spawnPercent": poke.pokemon[numClean - 1].spawn_chance,
		  "spawnsAvg": poke.pokemon[numClean - 1].avg_spawns,
		  "spawnTime": poke.pokemon[numClean - 1].spawn_time,
		  "multipliers": poke.pokemon[numClean - 1].multipliers,
		  "type": [],
		  "maxCP": $('.pok_top_block').eq(1).find('tr').eq(0).find('td').last().text(),
		  "CPperlvl": $('.pok_top_block').eq(1).find('tr').eq(1).find('td').last().text(),
		  "tierRank": $('.pok_top_block').eq(1).find('tr').eq(2).find('td').last().text(),
		  "baseAttack": $('.pok_top_block').eq(1).find('tr').eq(3).find('td').last().text(),
		  "baseDefense": $('.pok_top_block').eq(1).find('tr').eq(4).find('td').last().text(),
		  "baseStamina": $('.pok_top_block').eq(1).find('tr').eq(5).find('td').last().text(),
		  "capturePercent": $('.pok_top_block').eq(1).find('tr').eq(6).find('td').last().text().replace('%', ''),
		  "fleePercent": $('.pok_top_block').eq(1).find('tr').eq(7).find('td').last().text().replace('%', ''),
		  "evolPrev": [],
		  "evolPrevCandy": [],
		  "evolPrevPrev": [],
		  "evolPrevPrevCandy": [],
		  "evolNext": [],
		  "evolNextCandy": [],
		  "evolNextNext": [],
		  "evolNextNextCandy": [],
		  "buddyRange": $('.pok_top_block').prev('table').find('tr').first().find('td').last().text().replace(' KM', ''),
		  "buddySize": $('.pok_top_block').prev('table').find('tr').last().find('td').last().text(),
		  "strongAgainst": {
			"m064x": [],
			"m08x": []
		  },
		  "weakAgainst": {
			"m125x": [],
			"m156x": []
		  },
		  "spawnLoc": [],
		  "eggRange": $('.one_half').prev('table').first().find('tr').first().find('td').last().text().replace(/\sKM.*/g, ''),
		  "eggPerfectCP": $('.one_half').prev('table').first().find('tr').last().find('td').last().text().replace(/\sCP.*/g, ''),
		  "eggPercent": percentEggCol1.length > 0 ? percentEggCol1.next('td').text() : percentEggCol2.next('td').text(),
		  "quickMoves": [],
		  "chargeMoves": [],
		  "bestAttackMoveset": [],
		  "bestDefenceMoveset": [],
		};


		//скачиваем изображение покемона
		download($('.pok_main_img').attr('src'), 'img/pokemons/' + pokImg, function () {});

		//формируем типы покемона и скачиваем их изображения
		$('.pok_top_stats img').each(function () {
		  var type = $(this).attr('alt').replace('\-type', '');
		  data.type.push(capitalizeFirstLetter(type));
		  download($(this).attr('src'), 'img/types/' + type + '.png', function () {});
		});

		//формируем локации по типам
		$('.bottom_type_image').prev('table').each(function () {
		  var spawn = $(this).find('td').last().text();
		  data.spawnLoc.push(spawn);
		});

		//формируем атаки
		$('.one_move_row').first().closest('.pok_top_block').children('.one_move_row').each(function () {
		  var move = $(this).find('a').text();
		  data.quickMoves.push(move);
		});
		$('.one_move_row').first().closest('.pok_top_block').next('.pok_top_block').children('.one_move_row').each(function () {
		  var move = $(this).find('a').text();
		  data.chargeMoves.push(move);
		});

		//формируем лушее для атаки
		$('.offence_block').children('.one_move_row').each(function () {
		  var move = $(this).find('a').text();
		  data.bestAttackMoveset.push(move);
		});
		$('.defence_block').children('.one_move_row').each(function () {
		  var move = $(this).find('a').text();
		  data.bestDefenceMoveset.push(move);
		});

		//формируем сильные и слабые стороны
		$('.pws_table .t8x').prev('td').each(function () {
		  var type = $(this).find('img').attr('src').replace('https://rankedboost.com/wp-content/themes/RB2/riot/poksimages/', '').replace('.png', '');
		  data.strongAgainst.m08x.push(capitalizeFirstLetter(type));
		});
		$('.pws_table .t64x').prev('td').each(function () {
		  var type = $(this).find('img').attr('src').replace('https://rankedboost.com/wp-content/themes/RB2/riot/poksimages/', '').replace('.png', '');
		  data.strongAgainst.m064x.push(capitalizeFirstLetter(type));
		});
		$('.pws_table .t125x').prev('td').each(function () {
		  var type = $(this).find('img').attr('src').replace('https://rankedboost.com/wp-content/themes/RB2/riot/poksimages/', '').replace('.png', '');
		  data.weakAgainst.m125x.push(capitalizeFirstLetter(type));
		});
		$('.pws_table .t156x').prev('td').each(function () {
		  var type = $(this).find('img').attr('src').replace('https://rankedboost.com/wp-content/themes/RB2/riot/poksimages/', '').replace('.png', '');
		  data.weakAgainst.m156x.push(capitalizeFirstLetter(type));
		});

		//формируем эволюции
		var $evoBlock = $('.one_evo');
		if ($evoBlock.children().length == 5) {
		  if ($evoBlock.children().eq(2).children('img').length > 0) {
			data.evolPrev.push($evoBlock.children().eq(0).find('img').attr('src').replace(imgPath, '').replace('.png', ''));
			data.evolPrevCandy.push($evoBlock.children().eq(1).text());
			data.evolNext.push($evoBlock.children().eq(4).find('img').attr('src').replace(imgPath, '').replace('.png', ''));
			data.evolNextCandy.push($evoBlock.children().eq(3).text());
		  } else if ($evoBlock.children().eq(0).children('img').length > 0) {
			data.evolNext.push($evoBlock.children().eq(2).find('img').attr('src').replace(imgPath, '').replace('.png', ''));
			data.evolNextCandy.push($evoBlock.children().eq(1).text());
			data.evolNextNext.push($evoBlock.children().eq(4).find('img').attr('src').replace(imgPath, '').replace('.png', ''));
			data.evolNextNextCandy.push($evoBlock.children().eq(3).text());
		  } else {
			data.evolPrev.push($evoBlock.children().eq(2).find('img').attr('src').replace(imgPath, '').replace('.png', ''));
			data.evolPrevCandy.push($evoBlock.children().eq(3).text());
			data.evolPrevPrev.push($evoBlock.children().eq(0).find('img').attr('src').replace(imgPath, '').replace('.png', ''));
			data.evolPrevPrevCandy.push($evoBlock.children().eq(1).text());
		  }
		} else if ($evoBlock.children().length == 3) {
		  if ($evoBlock.children().eq(0).children('img').length > 0) {
			data.evolNext.push($evoBlock.children().eq(2).find('img').attr('src').replace(imgPath, '').replace('.png', ''));
			data.evolNextCandy.push($evoBlock.children().eq(1).text());
		  } else {

			data.evolPrev.push($evoBlock.children().eq(0).find('img').attr('src').replace(imgPath, '').replace('.png', ''));
			data.evolPrevCandy.push($evoBlock.children().eq(1).text());
		  }
		} else {
		  console.log('нет эволюций');
		}


		dataPokemons.push(data);

		fs.writeFile("data/pokemons.json", JSON.stringify(dataPokemons, null, '  '), function (err) {
		  if (err) {
			return console.log(err);
		  }
		  if (timeNum < 151) {
			timeNum = timeNum + 1;
		  }
		  console.log("The file was saved!");
		});
		
	  } else {
		console.log("Произошла ошибка: " + error);
	  }
	});
//}
}

//setTimeout(function(){
//  timeNum = 0;
//  getPokemon(timeNum);
//}, 2000);
setInterval(function(){
  getPokemon(timeNum);
  console.log(timeNum);
}, 7000);
