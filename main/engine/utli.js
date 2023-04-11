class Utli {
	static getOptions() {
		//生成请求头部
		var time = Date.now();
		let UserAgent = "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/" + 59 + Math.round(Math.random() * 10) + ".0.3497." + Math.round(Math.random() * 100) + "Safari/537.36";
		var options = {
			method: "POST",
			hostname: "tinypng.com",
			path: "/backend/opt/shrink",
			headers: {
				rejectUnauthorized: false,
				"Postman-Token": (time -= 5000),
				"Cache-Control": "no-cache",
				"Content-Type": "application/x-www-form-urlencoded",
				"User-Agent": UserAgent,
				"X-Forwarded-For": Utli.getIp(),
				Cookie: "",
			},
			timeout:5000
		};
		return options;
	}
	static getIp() {
		var _ = {
			random: function (start, end) {
				return parseInt(Math.random() * (end - start) + start);
			},
		};
		var ip = _.random(1, 254) + "." + _.random(1, 254) + "." + _.random(1, 254) + "." + _.random(1, 254);
		return ip;
	}
}
module.exports = Utli;
