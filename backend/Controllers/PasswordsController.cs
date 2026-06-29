using backend.Services.Passwords;
using backend.Services.Security;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("api/passwords")]
public class PasswordsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PasswordsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _mediator.Send(new GetAllPasswordsQuery(User.GetUserId())));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PasswordEntryInput input)
        => Ok(await _mediator.Send(new CreatePasswordCommand(User.GetUserId(), input)));

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] PasswordEntryInput input)
    {
        var result = await _mediator.Send(new UpdatePasswordCommand(User.GetUserId(), id, input));
        return result is null ? NotFound() : Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _mediator.Send(new DeletePasswordCommand(User.GetUserId(), id));
        return deleted ? NoContent() : NotFound();
    }
}
