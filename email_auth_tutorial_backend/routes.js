var express = require('express');
var router = express.Router();
const { UserDetails } = require("./user");
const { sendMail } = require('./services/mail.service');
const passport = require('passport');

const generateHash = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const sendVerificationEmail = async ({
  to,
  verificationHash,
  email
}) => {
  const linkAddress = `http://localhost:3000/verify-email?code=${verificationHash}&email=${email}`
  return await sendMail({
    to,
    subject: "Please verify your email",
    text: `Hi John,
    \nPlease click on the following link to verify your email:
    \n${linkAddress}
    \n
    \nSincerely,
    The Demo App Team`,
    html: `Hi John,
    <br>Please click on the following link to verify your email:
    <br><a href="${linkAddress}">${linkAddress}</a>
    <br><br>Sincerely,
    <br>The Demo App Team`
  }); 
}

router.route('/ping')
  .get((req, res) => {
    res.send({
      data: "pong"
    })
  });

router.route('/verify-email')
  .post(async (req, res) => {
    UserDetails.findOne({
      email: req.body.email,
      emailVerificationHash: req.body.code
    }, (err, account) => {
      if (err) {
        console.log(err);
        return res.status(400).send({ error: err.message });
      }
      if (account.emailVerified) {
        return res.status(200).send({data: "already verified"});
      }
      UserDetails.updateOne({_id: account.id}, {
        $set: {
          emailVerified: true
        }
      }, (_err) => {
        if (_err) {
          console.log(_err);
          return res.status(400).send({ error: _err.message });
        }
        return res.status(200).send({data: "done"})
      })
      
    })
  });

function checkAuthentication(req,res,next){
  if(req.isAuthenticated()) {
      next();
  } else{
      res.status(403).send({reason: "unauthenticated"});
  }
}

router.get('/user', checkAuthentication, (req, res) => {
  console.log(req.session, 'sesion', req.user)
  res.status(200).send({data: req.user.email})
})

router.route('/logout')
  .get((req, res) => {
    req.logout()
    res.status(200).send({data: "OK"})
  })

router.route('/login')
  .post((req, res, next) => {
    passport.authenticate('local',
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) { 
        return res.status(400).send({data: "no user"})
      }

      req.logIn(user, function(err) {
        if (err) {
          return res.status(400).send({data: "error"})
        }

        return res.status(200).send({data: "ok"})
      });

    })(req, res, next);
  })

router.route('/signup')
  .post((req, res) => {
    const emailVerificationHash = generateHash();
    UserDetails.register({
      username: req.body.username,
      email: req.body.email,
      emailVerified: false,
      emailVerificationHash
    }, req.body.password, async (err, account) => {
      if (err) {
        console.log(err);
        return res.status(400).send({ error: err.message });
      }
      await sendVerificationEmail({
        to: req.body.email,
        verificationHash: emailVerificationHash,
        email: req.body.email
      })
      res.status(200).send({ data: "ok" });
    })
  });

module.exports = router;
