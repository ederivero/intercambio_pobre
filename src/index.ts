import { Intercambio, Usuario } from './models'
import { AppDataSource } from './datasource'
import { config } from 'dotenv'

config()

function sorteo(usuarios: Array<{ slackId: string }>) {
  const usuariosEscogidos = [0]
  const resultadoSorteo = []
  let usuario = 0
  while (usuariosEscogidos.length !== usuarios.length) {
    const usuarioRandom = Math.floor(Math.random() * usuarios.length)
    if (usuarioRandom !== usuario) {
      if (!usuariosEscogidos.includes(usuarioRandom)) {
        resultadoSorteo.push([usuario, usuarioRandom])
        usuariosEscogidos.push(usuarioRandom)
        usuario++
      }
    }
  }
  return {
    resultadoSorteo,
  }
}

async function mandarSlackMessage(ahijadoId: string, usuarioId: string) {
  const body = {
    channel: usuarioId,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hola! :allo-wave: tu le regalarás a: <@${ahijadoId}> para el intercambio pobre :yaoming: que se realizará en la casa de <@U04044S37QV> el domingo 29 a las 14:00hrs. en https://maps.app.goo.gl/Mqw18FemZHVXqsuE7 \nRecuerda que el precio del regalo es 5 soles :xd: nos vemos :wave:`,
        },
      },
    ],
  }

  await fetch('https://slack.com/api/chat.postMessage', {
    headers: { Authorization: `Bearer ${process.env.SLACK_TOKEN}`, 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(body),
  })
}

async function main() {
  const resource = await AppDataSource.initialize()
  const usuarioRepositorio = resource.getRepository(Usuario)
  const usuariosQueJuegan = [
    'adrianaperez@ravn.co',
    'aliciamarroquin@ravn.co',
    'corenancco@ravn.co',
    'diegocahuayo@ravn.co',
    'fabiosoto@ravn.co',
    'gerardotamo@ravn.co',
    'gonzalo@ravn.co',
    'guido@ravn.co',
    'jackelinequispe@ravn.co',
    'joelvaldez@ravn.co',
    'rodrigochani@ravn.co',
    'sergiolaureano@ravn.co',
    'marialuque@ravn.co',
    'georgemaxi@ravn.co',
    'eduardomanrique@ravn.co',
  ]
  const usuarios = await usuarioRepositorio.find()

  if (usuarios.length !== usuariosQueJuegan.length) {
    const result = await fetch('https://slack.com/api/users.list?pretty=1', {
      headers: { Authorization: `Bearer ${process.env.SLACK_TOKEN}` },
    })
    const slackData = await result.json()

    const usuariosExistente = usuarios.map((usuario) => usuario.email)

    const slackMembersQueJuegan = usuariosQueJuegan
      .filter((usuarioQueJuega) => !usuariosExistente.includes(usuarioQueJuega))
      .map((usuarioQueJuega) =>
        slackData.members.find((member: { profile: { email?: string } }) => member.profile?.email === usuarioQueJuega)
      )

    for (const slackMemberQueJuega of slackMembersQueJuegan) {
      const nuevoUsuario = new Usuario()
      nuevoUsuario.slackId = slackMemberQueJuega.id
      nuevoUsuario.email = slackMemberQueJuega.profile.email
      await usuarioRepositorio.save(nuevoUsuario)
    }
  }
  const { resultadoSorteo } = sorteo(usuarios.map((usuario) => ({ slackId: usuario.slackId })))

  const intercambioRepositorio = resource.getRepository(Intercambio)

  for (let index = 0; index < resultadoSorteo.length; index++) {
    const angel = usuarios.find((usuario) => usuario.slackId === usuarios[resultadoSorteo[index][0]].slackId)

    const ahijado = usuarios.find((usuario) => usuario.slackId === usuarios[resultadoSorteo[index][1]].slackId)

    if (ahijado && angel) {
      const nuevoIntercambio = new Intercambio()
      nuevoIntercambio.ahijadoId = ahijado
      nuevoIntercambio.angelId = angel

      await intercambioRepositorio.save(nuevoIntercambio)

      await mandarSlackMessage(ahijado.slackId, angel.slackId)
    }
  }
}

main()
  .then(() => {
    console.log('Task executed successfully')
  })
  .catch((e) => {
    console.error('An error occured')
    console.error(e)
  })
