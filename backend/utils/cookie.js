// Send HTTP-only cookie

const cookie = (res, token, date) => {
  res.cookie("token", token, {
    path: "/", // le chemein ou la cookie sera stocker
    httpOnly: true, // rend le cookie inaccessible via JavaScript du côté client. Cela peut améliorer la sécurité
    expires: date, // 1 day
    sameSite: "none", // avec sameSite: "none" en utlise secure :true (autre explication: users dont have de samesite)
    secure: true, //  le cookie ne sera envoyé que sur des connexions HTTPS sécurisées
  });
};

module.exports = cookie
