import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const readComponent = (name) => readFile(new URL(`./${name}`, import.meta.url), 'utf8')

test('LoginForm keeps the cadastro link, API submit, and session states', async () => {
  const source = await readComponent('LoginForm.jsx')

  assert.match(source, /text-code-offwhite/)
  assert.match(source, /text-3xl/)
  assert.match(source, /onSubmit=\{handleSubmit\}/)
  assert.match(source, /await login\(/)
  assert.match(source, /await getProfile\(/)
  assert.match(source, /getAuthErrorMessage/)
  assert.match(source, /role="alert"/)
  assert.match(source, /href="\/cadastro"/)
  assert.match(source, /Crie seu cadastro!/)
})

test('SignupForm renders cadastro fields, API submit, and logged state', async () => {
  const source = await readComponent('SignupForm.jsx')

  assert.match(source, /Cadastro/)
  assert.match(source, /label="Nome"/)
  assert.match(source, /placeholder="Nome completo"/)
  assert.match(source, /label="Email"/)
  assert.match(source, /placeholder="Digite seu email"/)
  assert.match(source, /label="Senha"/)
  assert.match(source, /onSubmit=\{handleSubmit\}/)
  assert.match(source, /await register\(/)
  assert.match(source, /saveSession/)
  assert.match(source, /role="alert"/)
  assert.match(source, /Cadastro criado com sucesso/)
  assert.match(source, /Cadastrar/)
  assert.match(source, /href="\/login"/)
  assert.match(source, /Faca login/)
  assert.match(source, /text-code-accent/)
})
