  - [has](#has)
  - [has.environment](#hasenvironment)
  - [has.environment()](#hasenvironmentsettingsobjectdebuglevelstring)
  - [has.environment.default()](#hasenvironmentdefault)
  - [has.feature](#hasfeature)
  - [has.feature.enabled()](#hasfeatureenablednamestringproviderstring)
  - [has.file](#hasfile)
  - [has.file()](#hasfilefilestring)
  - [has.file.which_is_a_file()](#hasfilewhich_is_a_filefilestring)
  - [has.file.which_is_a_directory()](#hasfilewhich_is_a_directoryfilestring)
  - [has.file.which_is_hidden()](#hasfilewhich_is_hiddenfilestring)
  - [has.file.which_is_readonly()](#hasfilewhich_is_readonlyfilestring)
  - [has.file.which_is_a_system_file()](#hasfilewhich_is_a_system_filefilestring)
  - [has.file.get_content()](#hasfileget_contentfilestring)
  - [has.file.md5()](#hasfilemd5filestring)
  - [has.file.which_is_accesible_by_user()](#hasfilewhich_is_accesible_by_userfilestringuserstringaccessstring)
  - [has.file.which_contains()](#hasfilewhich_containsfilestringpatternstring)
  - [has.file.which_contains_between()](#hasfilewhich_contains_betweenfilestringpatternstringfromstringtostring)
  - [has.file.with_version()](#hasfilewith_versionfilestringversionstring)
  - [has.file.owned_by()](#hasfileowned_byfilestringownerstring)
  - [has.group](#hasgroup)
  - [has.group()](#hasgroupgroupstring)
  - [has.host](#hashost)
  - [has.host.resolvable()](#hashostresolvablenamestringtypestring)
  - [has.host.reachable()](#hashostreachablenamestringprotcolstringtimeoutstringportstring)
  - [has.hotfix](#hashotfix)
  - [has.iis_app_pool](#hasiis_app_pool)
  - [has.iis_app_pool.which_exists()](#hasiis_app_poolwhich_existsnamestring)
  - [has.iis_app_pool.with_dotnet_version()](#hasiis_app_poolwith_dotnet_versionnamestringverisonstring)
  - [has.iis_app_pool.with_32bit_enabled()](#hasiis_app_poolwith_32bit_enablednamestring)
  - [has.iis_app_pool.with_idle_timeout_of()](#hasiis_app_poolwith_idle_timeout_ofnamestring)
  - [has.iis_app_pool.with_identity_type()](#hasiis_app_poolwith_identity_typenamestringtypestring)
  - [has.iis_app_pool.with_user_profile()](#hasiis_app_poolwith_user_profilenamestring)
  - [has.iis_app_pool.which_has_username()](#hasiis_app_poolwhich_has_usernamenamestringusernamestring)
  - [has.iis_app_pool.with_periodic_restart_of()](#hasiis_app_poolwith_periodic_restart_ofnamestringtimeoutstring)
  - [has.iis_app_pool.which_has_managed_pipeline_mode()](#hasiis_app_poolwhich_has_managed_pipeline_modenamestringmodestring)
  - [has.iis_website](#hasiis_website)
  - [has.iis_website.installed()](#hasiis_websiteinstallednamestring)
  - [has.iis_website.running()](#hasiis_websiterunningnamestring)
  - [has.iis_website.in_app_pool()](#hasiis_websitein_app_poolnamestringpoolstring)
  - [has.iis_website.with_physical_path()](#hasiis_websitewith_physical_pathnamestringpathstring)
  - [has.iis_website.with_site_bindings()](#hasiis_websitewith_site_bindingsnamestringportstringprotocolstringipaddressstringhost_headerstring)
  - [has.iis_website.with_virtual_directory()](#hasiis_websitewith_virtual_directorynamestringvdirstringpathstring)
  - [has.iis_website.with_site_application()](#hasiis_websitewith_site_applicationnamestringappstringpoolstringphysical_pathstring)
  - [has.port](#hasport)
  - [has.port.listening()](#hasportlisteningportstring)
  - [has.port.listening.with_protocol()](#hasportlisteningwith_protocolportstringprotocolstring)
  - [has.process](#hasprocess)
  - [has.process.check()](#hasprocesscheckprocessstring)
  - [has.registry_key](#hasregistry_key)
  - [has.registry_key()](#hasregistry_keykey_namestring)
  - [has.scheduled_task](#hasscheduled_task)
  - [has.scheduled_task()](#hasscheduled_tasknamestring)
  - [has.service](#hasservice)
  - [has.service.installed()](#hasserviceinstalledservicestring)
  - [has.service.with_start_mode()](#hasservicewith_start_modeservicestringmodestring)
  - [has.service.enabled()](#hasserviceenabledservicestring)
  - [has.service.running()](#hasservicerunningservicestring)
  - [has.service.with_property()](#hasservicewith_propertyservicestringpropertystring)
  - [has.software_package](#hassoftware_package)
  - [has.software_package()](#hassoftware_packagesoft_packagestringversionstring)
  - [has.user](#hasuser)
  - [has.user()](#hasuseruserstring)
  - [has.user.who_belongs_to_group()](#hasuserwho_belongs_to_groupuserstringgroupstring)

## has

  

## has.environment

  The has environment. You should get the default settings first and then
  set with your updated params.

## has.environment(settings:object, debugLevel:string)

  Setup the environment - **needs to be called before any other commands**

## has.environment.default()

  Get the default environment settings

## has.feature

  Check if a host has a windows feature enabled/installed. 
  The provider is optional and can be used to validate how the feature was installed

## has.feature.enabled(name:string, [provider]:string)

  Check if Windows host has a Feature enabled/installed

## has.file

  File specific functionality. Use this to validate that a host has all the correct files.
  This is useful if you need to ensure config files are in place for services/applications.

## has.file(file:string)

  Check if a file exists on a host

## has.file.which_is_a_file(file:string)

  Check if a file is of type file

## has.file.which_is_a_directory(file:string)

  Check if a file is of type directory

## has.file.which_is_hidden(file:string)

  Check if a file is hidden

## has.file.which_is_readonly(file:string)

  Check if a file is read only

## has.file.which_is_a_system_file(file:string)

  Check if a file is a system file

## has.file.get_content(file:string)

  Get the files content

## has.file.md5(file:string)

  Check if a file is a system file

## has.file.which_is_accesible_by_user(file:string, user:string, access:string)

  Check if a file is accessible by a user

## has.file.which_contains(file:string, pattern:string)

  Check if a file contains a search pattern

## has.file.which_contains_between(file:string, pattern:string, from:string, to:string)

  Check if a file contains a search pattern

## has.file.with_version(file:string, version:string)

  Check if a file version matches

## has.file.owned_by(file:string, owner:string)

  Check if a file is owned by a user

## has.group

  Check that a user group exists on a server

## has.group(group:string)

  Check if a group exists

## has.host

  Check that a host can see the outside world

## has.host.resolvable(name:string, type:string)

  Check if a host is resolvable

## has.host.reachable(name:string, protcol:string, timeout:string, port:string)

  Check if a host is network reachable

## has.hotfix

  Check that a host has a windows hotfix installed

## has.iis_app_pool

  IIS Application Pool checks.

## has.iis_app_pool.which_exists(name:string)

  Check if a IIS App Pool exists

## has.iis_app_pool.with_dotnet_version(name:string, Verison:string)

  Check .Net version of IIS App Pool

## has.iis_app_pool.with_32bit_enabled(name:string)

  Check if IIS App Pool has 32 bit enabled

## has.iis_app_pool.with_idle_timeout_of(name:string)

  Check the idle timeout of an IIS App Pool

## has.iis_app_pool.with_identity_type(name:string, type:string)

  Check the identity of an IIS App Pool

## has.iis_app_pool.with_user_profile(name:string)

  Check the IIS App Pool has a user profile

## has.iis_app_pool.which_has_username(name:string, username:string)

  Check the IIS App Pool has a user name

## has.iis_app_pool.with_periodic_restart_of(name:string, timeout:string)

  Check the IIS App Pool has the correct periodic restart timeout

## has.iis_app_pool.which_has_managed_pipeline_mode(name:string, mode:string)

  Check the IIS App Pool has the correct managed piepline mode

## has.iis_website

  IIS Website checks.

## has.iis_website.installed(name:string)

  Check the IIS Web Site is installed

## has.iis_website.running(name:string)

  Check the IIS Web Site is running

## has.iis_website.in_app_pool(name:string, pool:string)

  Check the IIS Web Site is in the correct app pool

## has.iis_website.with_physical_path(name:string, path:string)

  Check the IIS Web Site has the correct physical path

## has.iis_website.with_site_bindings(name:string, port:string, protocol:string, ipaddress:string, host_header:string)

  Check the IIS Web Site has the correct site bindings

## has.iis_website.with_virtual_directory(name:string, vdir:string, path:string)

  Check the IIS Web Site has a virtual directory configured

## has.iis_website.with_site_application(name:string, app:string, pool:string, physical_path:string)

  Check the IIS Web Site has a site application configured

## has.port

  Check if a host has all the correct ports configured.

## has.port.listening(port:string)

  Check the host has a port listening

## has.port.listening.with_protocol(port:string, protocol:string)

  Check the host has a port listening with a specified protocol

## has.process

  Test process properties

## has.process.check(process:string)

  Check the host has a process

## has.registry_key

  Check that a Windows host has the correct registry keys

## has.registry_key(key_name:string)

  Check the windows host has the specified registry key

## has.scheduled_task

  Check that a host has a task scheduled as expected

## has.scheduled_task(name:string)

  Check the windows host has a task scheduled

## has.service

  Check that a host has all the correct services installed and that they are in the right state

## has.service.installed(service:string)

  Check the host has a service installed

## has.service.with_start_mode(service:string, mode:string)

  Check the host has a service with start mode

## has.service.enabled(service:string)

  Check the host has a service enabled

## has.service.running(service:string)

  Check the host has a service running

## has.service.with_property(service:string, property:string)

  Check the properties of a hosts service

## has.software_package

  Check that a host has the right software packages installed

## has.software_package(soft_package:string, [version]:string)

  Check the host has a software package installed

## has.user

  Check a host has the correct users

## has.user(user:string)

  Check the host has a user added/avaialble

## has.user.who_belongs_to_group(user:string, group:string)

  Check the host has a user who belongs to a specific group
