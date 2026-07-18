import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const readComponent = (name) => readFile(new URL(`./${name}`, import.meta.url), 'utf8')

test('LoginForm keeps the cadastro link and reusable auth form classes', async () => {
  const source = await readComponent('LoginForm.jsx')

  assert.match(source, /className="auth-form login-form"/)
  assert.match(source, /href="\/cadastro"/)
  assert.match(source, /Crie seu cadastro!/)
})

test('SignupForm renders the expected cadastro fields and login link', async () => {
  const source = await readComponent('SignupForm.jsx')

  assert.match(source, /Cadastro/)
  assert.match(source, /label="Nome"/)
  assert.match(source, /placeholder="Nome completo"/)
  assert.match(source, /label="Email"/)
  assert.match(source, /placeholder="Digite seu email"/)
  assert.match(source, /label="Senha"/)
  assert.match(source, /Cadastrar/)
  assert.match(source, /href="\/login"/)
  assert.match(source, /Faça seu login!/)
})
